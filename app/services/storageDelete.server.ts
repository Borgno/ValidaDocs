import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { minioClient } from "./storage.server";

const BUCKET_NAME = process.env.MINIO_BUCKET || "validadocs";

export async function deleteBatchFilesFromMinIO(batchId: string): Promise<void> {
  // Vamos buscar por arquivos que contenham batch-{batchId} nos prefixos conhecidos
  const prefixes = [
    `conciliacao/row/batch-${batchId}/`,
    `conciliacao/matched/batch-${batchId}/`,
    `conciliacao/unmatched/batch-${batchId}/`,
    `comprovantes-fat/row/doc-${batchId}/`,
    `pix-adm/raw/doc-${batchId}/`
  ];

  for (const prefix of prefixes) {
    try {
      const listCmd = new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix });
      const listedObjects = await minioClient.send(listCmd);

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) continue;

      for (const item of listedObjects.Contents) {
        if (item.Key) {
          console.log(`[MinIO Cleanup] Deletando: ${item.Key}`);
          await minioClient.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: item.Key }));
        }
      }
    } catch (err) {
      console.error(`[MinIO Warning] Erro ao limpar prefixo ${prefix}`, err);
    }
  }
}
