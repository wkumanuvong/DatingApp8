import { Component, OnInit, inject, input, output } from '@angular/core';
import { Member } from '../../_models/member';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Photo } from '../../_models/photo';
import { NgClass, NgIf, NgFor, NgStyle, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrl: './photo-editor.component.css',
    standalone: true,
    imports: [
        NgClass,
        FileUploadModule,
        NgIf,
        NgFor,
        NgStyle,
        DecimalPipe,
    ],
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          // set to also update navbar
          this.accountService.setCurrentUser(user);
        }
        const updatedMember = { ...this.member() };
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember);
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: () => {
        const updatedMember = { ...this.member() };
        updatedMember.photos = updatedMember.photos.filter(
          (x) => x.id !== photo.id
        );
        this.memberChange.emit(updatedMember);
      },
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        const updatedMember = { ...this.member() };
        updatedMember.photos.push(photo);
        this.memberChange.emit(updatedMember);
        if (photo.isMain) {
          const user = this.accountService.currentUser();
          if (user) {
            user.photoUrl = photo.url;
            this.accountService.setCurrentUser(user);
          }

          updatedMember.photoUrl = photo.url;
          updatedMember.photos.forEach((p) => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
          this.memberChange.emit(updatedMember);
        }
      }
    };
  }
}
