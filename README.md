# GR Simulation Service API

## API Endpoints

The API specifications can be found [here](https://simulation.innovationsarenan.dev/api/)

## Environmental variables

| name                       | example                                | description                       |
| -------------------------- | -------------------------------------- | --------------------------------- |
| PORT                       | 3000                                   | Serving port.                     |
| API_KEY                    | sup3rs3cr3tk3y                         | API key for calling the service.  |
| API_URL                    | simulation.innovationsarenan.dev/api   | Public URL.                       |
| DEFAULT_LLM_PROVIDER       | openai                                 | AI provider for LLMs.             |
| DEFAULT_LLM_MODEL          | gpt-5-mini                             | Default LLM model.                |
| DEFAULT_LLM_TEMPERATURE    | 0.5                                    | Default temperature for LLM.      |
| DEFAULT_LLM_MESSAGE_TOKENS | 400                                    | max token in message.             |
| SUMMARIZER_AGENT_MODEL     | gpt-5                                  | Default LLM for summerizer agent. |
| SUPERVISOR_AGENT_MODEL     | gpt-5                                  | Default LLM for supervisor agent. |
| OPENAI_API_KEY             | sk-proj-7HjY3...                       | OpenAI API key.                   |
| SUPABASE_URL               | https://supabase.innovationsarenan.dev | Public url for Supabase.          |
| SUPABASE_KEY               | eyJ0eX...                              | Supabase service token.           |
| REDIS_HOST                 | my-redis-host                          | Url/IP to Redis db incl auth.     |
| REDIS_PORT                 | 6379                                   | Port to Redis db.                 |
| AGENTS_TABLE_NAME          | agents                                 | Name of agents table.             |
| ENVIRONMENTS_TABLE_NAME    | environments                           | Name of environments table.       |
| SIMULATIONS_TABLE_NAME     | simulations                            | Name of simulations table.        |
| MESSAGES_TABLE_NAME        | messages                               | Name of messages table.           |
| INTERACTIONS_TABLE_NAME    | interactions                           | Name of interactions table.       |
