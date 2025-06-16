// scripts/testAgent.ts

import createChatAssistant from '../src/lib/agent.ts';

async function testAgent() {
  // Dummy fetchData implementation
  const fetchData = async (url: string): Promise<unknown> => {
    console.log(`Fetching data from ${url}...`);
    return { example: 'data' };
  };

  // Dummy summarizeText implementation
  const summarizeText = async (text: string): Promise<string> => {
    console.log(`Summarizing text: ${text}`);
    // Simple reverse-summary stub
    return text.split('').reverse().join('');
  };

  // Create the agent
  const assistant = createChatAssistant(fetchData, summarizeText);

  // Test URL
  const url = 'https://example.com/api/data';
  const summary = await assistant.retrieveAndSummarize(url);

  console.log('Test Result:', summary);
}

// Run the test
testAgent().catch(err => console.error('Error testing agent:', err));