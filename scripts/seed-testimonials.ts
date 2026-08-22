import mongoose from "mongoose";
import { loadProjectEnvironment } from "./load-project-environment";
import { demoTestimonials } from "../src/content/demo-testimonials";
import { parseMongoEnvironment } from "../src/config/env-schema";
import { connectMongoWithOptions } from "../src/infrastructure/database/mongoose-core";
import { TestimonialModel } from "../src/modules/testimonials/testimonial.model";

loadProjectEnvironment(process.cwd());

async function main() {
  const environment = parseMongoEnvironment(process.env);
  await connectMongoWithOptions({
    uri: environment.MONGODB_URI,
    database: environment.MONGODB_DATABASE,
  });
  for (const testimonial of demoTestimonials) {
    await TestimonialModel.findOneAndUpdate(
      { id: testimonial.id },
      { $set: testimonial },
      { upsert: true, runValidators: true },
    );
  }
  await TestimonialModel.syncIndexes();
  console.info(
    `Testimonials ready: ${await TestimonialModel.countDocuments()}`,
  );
}

try {
  await main();
} finally {
  await mongoose.disconnect();
}
