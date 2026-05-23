import type { IIssue, IIssueQuery } from "./issue.interface";
import { pool } from "../../db";

const createIssueToDB = async (payload: IIssue, reporter_id: number) => {
  //   console.log(payload);
  const { title, description, type } = payload;

  //   console.log(reporter_id);
  const UserData = await pool.query(
    `
        INSERT INTO issues(title,description,type,reporter_id) VALUES($1,$2,$3,$4)
        RETURNING *`,
    [title, description, type, reporter_id],
  );

  //   console.log(UserData);
  return UserData;
};
const getAllIssueFromDB = async (query: IIssueQuery) => {
  const { sort = "newest", type, status } = query;

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const orderClause = sort === "oldest" ? "ASC" : "DESC";

  const result = await pool.query(
    `SELECT * FROM issues
     ${whereClause}
     ORDER BY created_at ${orderClause}`,
    values,
  );

  const issues = result.rows;
  //   console.log(issues);
  const reporter_Ids = issues.map((i) => i.reporter_id);
  //   console.log(reporter_Ids);

  const reporters = await pool.query(
    `
        SELECT id,name,role FROM users WHERE id=ANY($1)
        `,
    [reporter_Ids],
  );
  const reporter = reporters.rows;
  //   console.log(reporter);

  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter.find((r) => r.id === issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM issues WHERE id=$1
        `,
    [id],
  );
  if (result.rows.length == 0) {
    throw new Error("No issue found");
  }

  const issue = result.rows[0];

  const reporters = await pool.query(
    `
        SELECT id,name,role FROM users WHERE id=$1
        `,
    [issue.reporter_id],
  );

  if (reporters.rows.length === 0) {
    throw new Error("No reporters found");
  }
  const reporter = reporters.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueToDB = async (
  id: string,
  reporter_id: number,
  role: string,
  payload: IIssue,
) => {
  const { title, description, type } = payload;
  const issues = await pool.query(
    `
         SELECT * FROM issues WHERE id=$1
        `,
    [id],
  );

  if (issues.rows.length === 0) {
    throw new Error("Issue is not found");
  }

  const issue = issues.rows[0];

  if (role === "contributor") {
    if (issue.reporter_id !== reporter_id) {
      throw new Error("Forbidden,The user has no permission");
    }
    if (issue.status !== "open") {
      throw new Error("Forbidden,The user has no permission");
    }
  }

  const updated = await pool.query(
    `UPDATE issues 
   SET title=$1, description=$2, type=$3, status='in_progress', updated_at=NOW()
   WHERE id=$4 
   RETURNING *`,
    [title, description, type, id],
  );
  return updated;
};

const deleteIssueToDB = async (id: string, role: string) => {
  const issues = await pool.query(
    `
         SELECT * FROM issues WHERE id=$1
        `,
    [id],
  );

  if (issues.rows.length === 0) {
    throw new Error("Issue is not found");
  }

  if (role !== "maintainer") {
    throw new Error("Forbidden,The user has no access");
  }

  const result = await pool.query(
    `DELETE FROM issues 
   WHERE id=$1`,
    [id],
  );
  return result;
};

export const issueService = {
  createIssueToDB,
  getAllIssueFromDB,
  getSingleIssueFromDB,
  updateIssueToDB,
  deleteIssueToDB,
};
