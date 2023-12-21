import dotenv from "dotenv";
import aws from "aws-sdk";

dotenv.config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new aws.S3({
  params: {Bucket: "reward-system-1998"},
  region: "ap-southeast-1"
});

const uploadFileToS3 = (filename, imageBuffer) => {
  return new Promise((resolve, reject) => {
    if (!imageBuffer) {
      reject(new Error("Image buffer not provided"));
      return;
    }

    const uploadParams = {
      Bucket: "reward-system-1998",
      Key: filename,
      Body: imageBuffer,
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // Return the S3 object URL
      }
    })
    .on("httpUploadProgress", (evt) => {
      console.log(
        "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
      );
    })
  });
};

const deleteFileFromS3 = async (s3Url) => {
  const urlParts = s3Url.split("/");
  const bucketName = urlParts[2];
  const objectKey = urlParts.slice(3).join("/");

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    return false;
  }
};

export { uploadFileToS3, deleteFileFromS3 };
