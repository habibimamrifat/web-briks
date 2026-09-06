import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../decorators/role.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('ALL')
  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
