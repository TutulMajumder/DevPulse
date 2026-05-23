export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
}

export interface IIssueQuery {
  sort?: string;
  type?: string;
  status?: string;
}
