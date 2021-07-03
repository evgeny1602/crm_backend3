import { Controller, Delete, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile, unlink } from 'fs';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { join } from 'path';

@Controller('files')
export class FilesController {

    private readonly staticDir = 'static';

    @Delete(':filename')
    @UseGuards(new AuthGuard())
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('filename') filename: string) {
        const fname = join(this.staticDir, filename);
        unlink(fname, () => {
            console.log(`${fname} removed`)
        });
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(new AuthGuard())
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        writeFile(join(this.staticDir, file.originalname), file.buffer, err => {
            return file.originalname;
        });
    }



}
