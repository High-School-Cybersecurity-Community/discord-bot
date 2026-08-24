import { defineConfig } from 'tsdown/config';

const env = Object.fromEntries(
  Object.entries(process.env)
    .filter(([key]) => key.startsWith('PUBLIC_'))
)

export default defineConfig({
    env,
})
