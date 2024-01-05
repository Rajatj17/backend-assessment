import { Controller, Get, Body, UseGuards, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ICurrentUser } from './types';
import { transformSearchToUserResponse } from './dto/search-response.dto';

@Controller()
export class NotesSearchController {
  constructor(private readonly notesService: NotesService) {}

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async search(
    @CurrentUser() currentUser: ICurrentUser,
    @Query('q') q: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    const notes = await this.notesService.search(+currentUser.sub, q, take, skip);

    return {
      success: true,
      message: 'Notes Fetched Successfully!',
      data: {
        count: notes[1],
        notes: transformSearchToUserResponse(notes[0]),
        current_limit: take ?? 30,
        current_offset: skip ?? 0
      }
    }
  }
}
