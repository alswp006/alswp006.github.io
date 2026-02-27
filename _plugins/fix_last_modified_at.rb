# frozen_string_literal: true

# Monkey-patch for jekyll-last-modified-at 1.3.2
# Fixes: undefined method `[]' for nil:NilClass when Executor.sh returns nil
module Jekyll
  module LastModifiedAt
    class Determinator
      def last_modified_at_unix
        if git.git_repo?
          result = Executor.sh(
            "git",
            "--git-dir",
            git.top_level_directory,
            "log",
            "-n",
            "1",
            '--format="%ct"',
            "--",
            relative_path_from_git_dir
          )
          last_commit_date = result&.[](/\d+/)
          last_commit_date.nil? || last_commit_date.empty? ? mtime(absolute_path_to_article) : last_commit_date
        else
          mtime(absolute_path_to_article)
        end
      end
    end
  end
end
