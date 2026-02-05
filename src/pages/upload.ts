//https://events-assets.purduehackers.com/creaturas/creaturas/__1ZvXoUhvrAR4iVMZ82l.png
//https://event-assets.purduehackers.com/creaturas/__1ZvXoUhvrAR4iVMZ82l.png
import type { APIContext } from 'astro';
import { getSecret } from "astro:env/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { nanoid } from "nanoid";

export const prerender = false;

export async function POST({ request }: APIContext) {
  const form = await request.formData();
  const blob = form.get('file') as Blob;
  const buffer = await blob.arrayBuffer();

  const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${getSecret("R2_ACCOUNT_ID")!}.r2.cloudflarestorage.com`,
      credentials: {
          accessKeyId: getSecret("R2_ACCESS_KEY_ID")!,
          secretAccessKey: getSecret("R2_SECRET_ACCESS_KEY")!,
      },
  });

  const bucket = getSecret("R2_BUCKET_NAME");

  const id = nanoid();
  const key = `creaturas/${id}.png`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: blob.type,
      ContentLength: buffer.byteLength,
    }),
  );

  const hook = new WebhookClient({ url: getSecret("DISCORD_WEBHOOK_URL")! });
  const embed = new EmbedBuilder()
      .setTitle('new creatura uploaded :3')
      .setDescription(`[link](https://event-assets.purduehackers.com/${key})`)
      .setColor(0xffffff)
      .setImage(`https://event-assets.purduehackers.com/${key}`)

  await hook.send({
    embeds: [embed]
  });

  return new Response(null, {
    status: 200,
  });
}
