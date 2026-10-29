import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',
  timeout:30000,
  fullyParallel:true,
  workers:2,
  reporter:[['list'],['html',{open:'never'}]],
  // Use the browser pinned to this Playwright version on both Mac and CI.
  // A separately updated system Chrome can outpace the installed test runner.
  use:{baseURL:'http://127.0.0.1:4173/manuscripts/',headless:true,viewport:{width:1440,height:1100},trace:'retain-on-failure'},
  webServer:[
    {command:'node scripts/serve.mjs --root dist/demo --port 4173 --base /manuscripts',url:'http://127.0.0.1:4173/manuscripts/',reuseExistingServer:false},
    {command:'node scripts/serve.mjs --root dist/public --port 4174 --base /manuscripts',url:'http://127.0.0.1:4174/manuscripts/',reuseExistingServer:false},
  ],
});
