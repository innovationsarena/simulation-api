import { Worker } from "bullmq";

new Worker("conversationQueue", async (job) => {
  // Get conversation
  // find out whos turn it is
  // Parse messages
});
