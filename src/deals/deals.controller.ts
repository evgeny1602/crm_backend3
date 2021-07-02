import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { DealResponseInterface } from './types/dealResponse.interface';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { DealsResponseInterface } from './types/dealsResponseInterface';

@Controller('deals')
export class DealsController {

  constructor(
    private readonly dealsService: DealsService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createDealDto: CreateDealDto
  ): Promise<DealResponseInterface> {
    const deal = await this.dealsService.create(createDealDto);
    return this.dealsService.buildDealResponse(deal);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: any
  ): Promise<DealsResponseInterface> {
    const dealsData = await this.dealsService.findAll(query);
    return this.dealsService.buildDealsResponse(
      dealsData.deals,
      dealsData.dealsCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string
  ): Promise<DealResponseInterface> {
    const deal = await this.dealsService.findOne(+id);
    return this.dealsService.buildDealResponse(deal);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDealDto: UpdateDealDto
  ): Promise<DealResponseInterface> {
    const deal = await this.dealsService.update(
      +id,
      updateDealDto
    );
    return this.dealsService.buildDealResponse(deal);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string
  ) {
    return this.dealsService.remove(+id);
  }

}
