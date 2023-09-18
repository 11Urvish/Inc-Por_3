import * as dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV === undefined ? "development" : process.env.NODE_ENV;

export default {
  NODE_ENV: env,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  // SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "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",
  //SENDGRID_API_KEY: "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",
  //SENDGRID_API_KEY: "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",
  SENDGRID_API_KEY: "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", // prasant account

  // AWS_BUCKET: process.env.AWS_BUCKET || "monaxi-dev-bucket",
  // AWS_REGION: process.env.AWS_REGION || "us-east-1",
  // AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || "AKIAWM7MFMSFCBMIJUE3",//AKIAXWL2F63Y6RA5LQK3
  // AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || "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",// 7cF4UCwGA6qjr0na8IdJrkBG4PfrGYXdv+5ZJR+6

  AWS_BUCKET: process.env.DEVELOPMENT_AWS_BUCKET || "new-orbitpluse-dev-bucket",
  AWS_REGION: process.env.DEVELOPMENT_AWS_REGION || "us-east-1",
  AWS_ACCESS_KEY: process.env.DEVELOPMENT_AWS_ACCESS_KEY || "AKIAXWL2F63Y2E4NR27C",
  AWS_SECRET_KEY: process.env.DEVELOPMENT_AWS_SECRET_KEY || "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",
};
