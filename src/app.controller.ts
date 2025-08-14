import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
    constructor() {}

    @Get('health')
    health() {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        }
    }
}
