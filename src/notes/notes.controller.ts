import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ICurrentUser, NotesToUserRole } from './types';
import { Throttle } from '@nestjs/throttler';
import { ShareNoteDto } from './dto/share-note.dto';
import { NotesToUserService } from './notes-to-user.service';
import { transformNoteToUserResponse } from './dto/find-all-response.dto';
import { UsersService } from 'src/users/users.service';
import { ThrottlerCustomGuard } from 'src/common/guards/throttle.guard';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly notesToUserService: NotesToUserService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, ThrottlerCustomGuard)
  @Throttle({ default: { limit: 2, ttl: 5 * 1000 } }) // 2 calls in 5 seconds
  async create(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() createNoteDto: CreateNoteDto
  ) {
    const note = await this.notesService.create(createNoteDto, currentUser.sub);

    return {
      success: true,
      message: 'Note successfully created!',
      data: {
        note
      }
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('id') id: string
  ) {
    const entity = await this.notesToUserService.count({
      noteId: +id,
      userId: currentUser.sub
    })
    if (!entity) {
      throw new ForbiddenException()
    }
   
    const note = await this.notesService.findOne(+id);

    return {
      success: true,
      message: 'Note Found Successfully!',
      data: {
        note
      }
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, ThrottlerCustomGuard)
  @Throttle({ default: { limit: 40, ttl: 60 * 1000 } }) // 40 calls in 60 seconds
  async findAll(
    @CurrentUser() currentUser: ICurrentUser,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    const notes = await this.notesToUserService.findAll(currentUser.sub, take, skip);

    return {
      success: true,
      message: 'Notes list!',
      data: {
        count: notes[1],
        notes: transformNoteToUserResponse(notes[0]),
        current_limit: take ?? 30,
        current_offset: skip ?? 0
      }
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, ThrottlerCustomGuard)
  @Throttle({ default: { limit: 1, ttl: 5 * 1000 } })
  async update(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto
  ) {
    const entity = await this.notesToUserService.count({
      noteId: +id,
      userId: currentUser.sub,
      role: NotesToUserRole.AUTHOR
    })
    if (!entity) {
      throw new ForbiddenException()
    }

    await this.notesService.update(+id, updateNoteDto);

    return {
      success: true,
      message: 'Note Updated Successfully!',
      data: {}
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, ThrottlerCustomGuard)
  @Throttle({ default: { limit: 1, ttl: 5 * 1000 } })
  async remove(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('id') id: string
  ) {
    const entity = await this.notesToUserService.count({
      noteId: +id,
      userId: currentUser.sub,
      role: NotesToUserRole.AUTHOR
    })
    if (!entity) {
      throw new ForbiddenException()
    }

    await this.notesService.remove(+id);

    return {
      success: true,
      message: 'Note Deleted Successfully!',
      data: {}
    }
  }

  @Post(':id/share')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async share(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('id') id: string,
    @Body() shareNoteDto: ShareNoteDto,
  ) {
    const entity = await this.notesToUserService.count({
      noteId: +id,
      userId: currentUser.sub,
      role: NotesToUserRole.AUTHOR
    })
    if (!entity) {
      throw new ForbiddenException()
    }

    const user = await this.userService.findOne({
      id: shareNoteDto.userId
    });
    if (!user) {
      throw new HttpException("Requested User does not exist on platform!", HttpStatus.BAD_REQUEST);
    }

    await this.notesToUserService.create(shareNoteDto.userId, +id);

    return {
      success: true,
      message: 'Note shared successfully!',
      data: {}
    }
  }
}
