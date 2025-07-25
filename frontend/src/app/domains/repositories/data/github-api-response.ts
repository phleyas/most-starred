export interface GithubApiResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepository[];
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}
