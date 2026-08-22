import type { DemoService } from "@/content/demo-content";

const serviceImages = {
  general: "https://images.pexels.com/photos/6529057/pexels-photo-6529057.jpeg?auto=compress&cs=tinysrgb&w=900",
  orthodontics: "https://images.pexels.com/photos/6529105/pexels-photo-6529105.jpeg?auto=compress&cs=tinysrgb&w=900",
  prosthesis: "https://images.pexels.com/photos/6528782/pexels-photo-6528782.jpeg?auto=compress&cs=tinysrgb&w=900",
  treatment: "https://images.pexels.com/photos/6529110/pexels-photo-6529110.jpeg?auto=compress&cs=tinysrgb&w=900",
  whitening: "https://images.pexels.com/photos/5622271/pexels-photo-5622271.jpeg?auto=compress&cs=tinysrgb&w=900",
} as const;

export function getServiceImageSource(service: DemoService): string {
  const value = `${service.id} ${service.name.en}`.toLowerCase();
  if (/whiten|bleach/.test(value)) return serviceImages.whitening;
  if (/brace|orthodont|aligner/.test(value)) return serviceImages.orthodontics;
  if (/implant|denture|crown|bridge|prostho/.test(value)) return serviceImages.prosthesis;
  if (/root canal|filling|restor|extraction/.test(value)) return serviceImages.treatment;
  return serviceImages.general;
}
