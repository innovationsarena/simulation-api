import { Worker } from "bullmq";
import { createBigFiveEvaluation, getAgentById } from "../../agents";
import { evaluateBigfive } from "../bfi2";
import { BigFiveEvaluation } from "../../../core";

new Worker(
  "evaluationsQueue",
  async (job) => {
    if (job.name === "evaluation.bigfive") {
      const { agentId, sample } = job.data;
      const resultsArr = [];
      const agent = await getAgentById(agentId);

      for (let i = 0; i < sample * 1; i++) {
        console.log(`Evaluating sample ${i + 1}`);
        const percent = await evaluateBigfive(agent);
        resultsArr.push(percent);
      }

      const results: BigFiveEvaluation = {
        samples: sample,
        results: {
          min: Math.min(...resultsArr),
          max: Math.max(...resultsArr),
          avg: resultsArr.reduce((a, b) => a + b) / resultsArr.length,
        },
      };

      console.log(
        `Evaluation done and written to Agent. Results in ${sample} samples: ${JSON.stringify(
          results.results
        )}`
      );
      await createBigFiveEvaluation(agentId, results);
      return results;
    }
  },
  { connection: { port: 6379, host: "127.0.0.1" }, concurrency: 50 }
);
