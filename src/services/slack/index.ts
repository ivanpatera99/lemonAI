import {WebClient, LogLevel} from "@slack/web-api";
import { Flags, FlagsMap} from "../../flags";
require("dotenv").config();

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    logLevel: LogLevel.DEBUG
  });

export const getConversationWithFilters = async (channel: string, filters: FlagsMap): Promise<{conversation: string, cursor: string}> => {
    const limitFilter = filters.get(Flags.LIMIT)
    const latest = filters.get(Flags.LATEST) !== undefined ? dateToUnixTimestamp(new Date(filters.get(Flags.LATEST) || '')) : undefined
    const oldest = filters.get(Flags.OLDEST) !== undefined ? dateToUnixTimestamp(new Date(filters.get(Flags.OLDEST) || '')) : undefined
    if (limitFilter !== undefined || (latest !== undefined && oldest !== undefined)) {
        throw new Error("LIMIT_AND_LATEST_OLDEST_NOT_ALLOWED")
    }
    const conversationResult = await client.conversations.history({
        channel: channel, 
        latest, 
        oldest,
        limit: limitFilter !== undefined ? parseInt(limitFilter) : undefined,
        next_cursor: filters.get(Flags.NEXT_CURSOR),
    });
    const conversation = conversationResult
    .messages?.filter(message => message.bot_id === undefined)
    .map(message => message.text ? 
        `${message.user}@${message.ts}${message.thread_ts ? `(thread_ts:${message.thread_ts})` : ``}: ${message.text}` 
        : null)
    .join('\n')
    console.log(`CONVERSATION: ${conversation}`)
    if (!conversation) {
        throw new Error("NO_CONVERSATION")
    }
    return {conversation, cursor: conversationResult.response_metadata?.next_cursor || ""}
}

export const postEphemeral = async (channel: string, user: string, text: string): Promise<void> => {
    await client.chat.postEphemeral({
        token: process.env.SLACK_BOT_TOKEN,
        channel,
        user,
        text
    });
}

const dateToUnixTimestamp = (date: Date): string => {
    return Math.floor(date.getTime() / 1000).toString()
}