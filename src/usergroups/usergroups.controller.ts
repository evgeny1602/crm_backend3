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
import { UsergroupsService } from './usergroups.service';
import { CreateUsergroupDto } from './dto/create-usergroup.dto';
import { UpdateUsergroupDto } from './dto/update-usergroup.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { UsergroupResponseInterface } from './types/usergroupResponse.interface';
import { UsergroupsResponseInterface } from './types/usergroupsResponse.interface';

@Controller('usergroups')
export class UsergroupsController {

  constructor(
    private readonly usergroupsService: UsergroupsService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createUsergroupDto: CreateUsergroupDto
  ): Promise<UsergroupResponseInterface> {
    const usergroup = await this.usergroupsService.create(createUsergroupDto);
    return this.usergroupsService.buildUsergroupResponse(usergroup);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findAll(
    @Query() query: any
  ): Promise<UsergroupsResponseInterface> {
    const usergroupsData = await this.usergroupsService.findAll(query);
    return this.usergroupsService.buildUsergroupsResponse(
      usergroupsData.usergroups,
      usergroupsData.usergroupsCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findOne(
    @Param('id') id: string
  ): Promise<UsergroupResponseInterface> {
    const usergroup = await this.usergroupsService.findOne(+id);
    return this.usergroupsService.buildUsergroupResponse(usergroup);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUsergroupDto: UpdateUsergroupDto
  ): Promise<UsergroupResponseInterface> {
    const usergroup = await this.usergroupsService.update(
      +id,
      updateUsergroupDto
    );
    return this.usergroupsService.buildUsergroupResponse(usergroup);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usergroupsService.remove(+id);
  }
}
