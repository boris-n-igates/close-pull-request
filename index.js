
import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
 

async function run(){

    try {
        const token = getInput('github_token',{required: true});
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
    
    } catch (error) {
      setFailed(error.message);
    }

    core.info(`Pull request ${context.issue.number} was closed`);
}

run();

