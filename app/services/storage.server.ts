import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const minioClient = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}`,
  region: "us-east-1", // Padrão necessário pelo AWS SDK mesmo em MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY as string,
    secretAccessKey: process.env.MINIO_SECRET_KEY as string,
  },
  forcePathStyle: true, // Obrigatório para o MinIO funcionar corretamente com a API S3
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "validadocs";

export async function uploadToMinIO(file: File, key: string): Promise<string> {
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
