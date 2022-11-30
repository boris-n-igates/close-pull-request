
const core = require('@actions/core');
const github = require('@actions/github');

async function run(){

    try {
        const token = core.getInput('github_token');
        const comment = core.getInput('comment') || '';
        const context = github.context;
    
        if(context.eventName != 'pull_request'){
            _error('Only works with pull request events');
        }
    
        const client = github.getOctokit(token);

        
        if (comment !== '') {
          await client.issues.createComment({
            ...context.repo,
            issue_number: context.issue.number,
            comment,
          });
        }

        await client.rest.pulls.update({
            ...context.repo,
            pull_number: context.issue.number,
            state: "closed"
        });

        core.info(`Pull request ${context.issue.number} was closed`);
    
    } catch (error) {
      core.setFailed(error.message);
    }

    
}

run();

