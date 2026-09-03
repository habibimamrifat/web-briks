import { Module } from '@nestjs/common';
import { WorkflowStatesController } from './workflow-statw.controller';
import { WorkflowStatesService } from './workflow-state.service';

@Module({
  controllers: [WorkflowStatesController],
  providers: [WorkflowStatesService],
  exports: [WorkflowStatesService],
})
export class WorkflowStatesModule {}
