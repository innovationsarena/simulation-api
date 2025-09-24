# GR Simulation Service API

## API Endpoints

| Enpoint                       | Method   | Async | Input              | Output                   | Description                                 |
| ----------------------------- | -------- | ----- | ------------------ | ------------------------ | ------------------------------------------- |
| /simulations                  | _POST_   | NO    | `SimulationInput`  | `Simulation`             | Creates new `Simulation`.                   |
| /simulations/:id              | _GET_    | NO    | -                  | `Simulation`             | Returns `Simulation`.                       |
| /simulations/:id              | _PATCH_  | NO    | `SimulationInput`  | `Simulation`             | Updates `Simulation`.                       |
| /simulations/:id/start        | _PATCH_  | YES   | -                  | `GenericMessageResponse` | Starts simulation.                          |
| /simulations/:id/stop         | _PATCH_  | YES   | -                  | `GenericMessageResponse` | Stops simulation.                           |
| /simulations/:id              | _DELETE_ | NO    | -                  | `GenericMessageResponse` | Starts simulation.                          |
| /simulations/:id/agents       | _GET_    | NO    | -                  | `Agent[]`                | List all agents in a simulation.            |
| /simulations/:id/interactions | _GET_    | NO    | -                  | `Interaction[]`          | List all interactions in a simulation.      |
| /simulations/:id/messages     | _GET_    | NO    | -                  | `Message[]`              | List all messages produced in a simulation. |
| /agents                       | _POST_   | NO    | `AgentInput`       | `Agent`                  | Creates new **Data derived** `Agent`.       |
| /agents/custom                | _POST_   | NO    | `CustomAgentInput` | `Agent`                  | Creates new **Custom** `Agent`.             |
| /agents/random                | _POST_   | NO    | `RandomAgentInput` | `Agent`                  | Creates new **Random** `Agent`.             |
| /agents/:id                   | _GET_    | NO    | -                  | `Agent`                  | Returns `Agent`.                            |
| /agents/:id                   | _PATCH_  | NO    | `AgentInput`       | `Agent`                  | Updates `Agent`.                            |
| /agents/:id                   | _DELETE_ | NO    | -                  | `GenericMessageResponse` | *DELETE*s `Agent`.                          |
| /agents/:id/messages          | _GET_    | NO    | -                  | `Message[]`              | List all messages produced by a agent.      |
| /agents/:id/evaluate          | _POST_   | YES   | `EvaluationInput`  | `Agent`                  | Evaluate agent.                             |
| /environments                 | _POST_   | NO    | `EnvironmentInput` | `Environment`            | Creates new `Environment`.                  |
| /environments/:id             | _GET_    | NO    | -                  | `Environment`            | Returns `Environment`.                      |
| /environments/:id             | _PATCH_  | NO    | `EnvironmentInput` | `Environment`            | Updates `Environment`.                      |
| /environments/:id             | _DELETE_ | NO    | `EnvironmentInput` | `Environment`            | *DELETE*s `Environment`.                    |
| /interactions                 | _POST_   | NO    | `InteractionInput` | `Interaction`            | Creates new `Interaction`, 'Discussion'     |
| /interactions/:id             | _GET_    | NO    | -                  | `Interaction`            | Returns `Interaction`.                      |
| /interactions/:id             | _PATCH_  | NO    | `InteractionInput` | `Interaction`            | Updates `Interaction`.                      |
| /interactions/:id             | _DELETE_ | NO    | -                  | `GenericMessageResponse` | *DELETE*s `Interaction`.                    |
| /interactions/:id/messages    | _GET_    | NO    | -                  | `Message[]`              | List all messages in a Interaction.         |
