// chat-assistant.ts

type FetchDataFunction = (url: string) => Promise<unknown>;
type SummarizeTextFunction = (text: string) => Promise<string>;

interface ChatAssistant {
    fetchData: FetchDataFunction;
    summarizeText: SummarizeTextFunction;
    retrieveAndSummarize: (url: string) => Promise<string>;
}

const createChatAssistant = (fetchData: FetchDataFunction, summarizeText: SummarizeTextFunction): ChatAssistant => {
    const retrieveAndSummarize = async (url: string): Promise<string> => {
        try {
            const data = await fetchData(url);
            const summary = await summarizeText(JSON.stringify(data));
            return formatSummary(summary);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return `Error fetching data: ${message}`;
        }
    };

    const formatSummary = (summary: string): string => {
        return `Here is the summary:\n- ${summary.split('. ').join('\n- ')}`;
    };

    return {
        fetchData,
        summarizeText,
        retrieveAndSummarize,
    };
};

export default createChatAssistant;
