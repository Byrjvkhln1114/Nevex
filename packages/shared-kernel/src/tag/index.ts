export type DomainSlug =
  | "treasury"
  | "vitality"
  | "presence"
  | "environment"
  | "trajectory";

export interface Tag {
  readonly id: string;
  readonly label: string;
  readonly domains: DomainSlug[]; // a tag can span multiple domains
  readonly color?: string;
}
