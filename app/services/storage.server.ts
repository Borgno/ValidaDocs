import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";

let endpointHost = process.env.MINIO_ENDPOINT || 'localhost';
if (process.env.RUNNING_IN_DOCKER === "true" && (endpointHost === 'localhost' || endpointHost === '127.0.0.1')) {
  endpointHost = 'minio';
}

const minioClient = new S3Client({
  endpoint: `http://${endpointHost}:${process.env.MINIO_PORT || 9000}`,
  region: "us-east-1", // Padrão necessário pelo AWS SDK mesmo em MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY as string,
    secretAccessKey: process.env.MINIO_SECRET_KEY as string,
  },
  forcePathStyle: true, // Obrigatório para o MinIO funcionar corretamente com a API S3
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "validadocs";

let bucketChecked = false;

async function ensureBucketExists() {
  if (bucketChecked) return;
  try {
    await minioClient.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    bucketChecked = true;
  } catch (error: any) {
    if (error.$metadata?.httpStatusCode === 404 || error.name === 'NotFound') {
      try {
        await minioClient.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`[MinIO] Bucket '${BUCKET_NAME}' created successfully.`);
        bucketChecked = true;
      } catch (createError) {
        console.error(`[MinIO] Failed to create bucket '${BUCKET_NAME}'`, createError);
      }
    } else {
      console.error(`[MinIO] Error checking bucket '${BUCKET_NAME}'`, error);
    }
  }
}

export async function deleteFromMinIO(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  try {
    await minioClient.send(command);
  } catch (error) {
    console.warn(`[MinIO Warning] Falha ao excluir arquivo ou arquivo já inexistente: ${key}`, error);
  }
}

export async function fileExistsInMinIO(key: string): Promise<boolean> {
  try {
    await minioClient.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

export async function uploadToMinIO(file: File, key: string): Promise<string> {
  await ensureBucketExists();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await minioClient.send(command);
  return key;
}

export async function uploadBufferToMinIO(buffer: Buffer | Uint8Array, key: string, contentType = "application/pdf"): Promise<string> {
  await ensureBucketExists();
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: contentType,
  });

  await minioClient.send(command);
  return key;
}

export async function downloadFromMinIO(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await minioClient.send(command);
  
  if (!response.Body) {
    throw new Error(`File not found in MinIO bucket (${BUCKET_NAME}): ${key}`);
  }

  // Tratamento da Stream em ambiente Node.js
  const stream = response.Body as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
