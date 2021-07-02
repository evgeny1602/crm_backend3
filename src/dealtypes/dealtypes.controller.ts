import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { DealtypesService } from './dealtypes.service';
import { CreateDealtypeDto } from './dto/create-dealtype.dto';
import { UpdateDealtypeDto } from './dto/update-dealtype.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { DealtypeResponseInterface } from './types/dealtypeResponse.interface';
import { DealtypesResponseInterface } from './types/dealtypesResponse.interface';

@Controller('dealtypes')
export class DealtypesController {

  constructor(
    private readonly dealtypesService: DealtypesService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createDealtypeDto: CreateDealtypeDto
  ): Promise<DealtypeResponseInterface> {
    const dealtype = await this.dealtypesService.create(createDealtypeDto);
    return this.dealtypesService.buildDealtypeResponse(dealtype);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findAll(
    @Query() query: any
  ): Promise<DealtypesResponseInterface> {
    const dealtypesData = await this.dealtypesService.findAll(query);
    return this.dealtypesService.buildDealtypesResponse(
      dealtypesData.dealtypes,
      dealtypesData.dealtypesCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findOne(
    @Param('id') id: string
  ): Promise<DealtypeResponseInterface> {
    const dealtype = await this.dealtypesService.findOne(+id);
    return this.dealtypesService.buildDealtypeResponse(dealtype);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateDealtypeDto: UpdateDealtypeDto
  ): Promise<DealtypeResponseInterface> {
    const dealtype = await this.dealtypesService.update(
      +id,
      updateDealtypeDto
    );
    return this.dealtypesService.buildDealtypeResponse(dealtype);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.dealtypesService.remove(+id);
  }
}
