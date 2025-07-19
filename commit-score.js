const axios =require('axios');
const fs =require('fs');

const owner= 'Viswesh934';
const repo='noAI';
const readmeFile = 'README.md';

const githubToken = process.env.GITHUB_TOKEN

async function updateScores(){
   try{
     const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
       {
         headers:{
           Authorization: `token ${githubToken}`,
           'User-Agent': 'commit-score-script'
         }
       }
       );

const contributors = response.data;

if(!Array.isArray(contributors)){
  console.error('Unexpected response format or stats not ready yet.');
  return;
}


  const scores = contributors
      .map(contributor => {
        const username = contributor.author.login;
        const totalCommits = contributor.total;
        return `- **${username}**: ${totalCommits} commits`;
      })
      .join('\n');

    

 const readmeContent = fs.readFileSync(readmeFile, 'utf8');
    const updatedReadmeContent = readmeContent.replace(
      /<!-- commit scores -->[\s\S]*?<!-- \/commit scores -->/,
      `<!-- commit scores -->\n${scores}\n<!-- /commit scores -->`
    );

    fs.writeFileSync(readmeFile, updatedReadmeContent);
    console.log(' README updated with commit scores.');
  } catch (error) {
    console.error('Error fetching commit stats:', error.message);
  }
}

updateScores();
       
