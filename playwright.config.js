import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'project-name/test/browser',timeout:240000,workers:1,reporter:'list',use:{browserName:'chromium',channel:'msedge',headless:true,viewport:{width:1440,height:1000},launchOptions:{args:['--enable-unsafe-webgpu','--disable-background-timer-throttling','--disable-renderer-backgrounding']}}});
