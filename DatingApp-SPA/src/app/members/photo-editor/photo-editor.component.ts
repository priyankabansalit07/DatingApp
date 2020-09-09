import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { error } from 'protractor';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver: false;
  response: string;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;

  constructor(private _authService: AuthService, private _userService: UserService, private _alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/" + this._authService.decodeToken.nameid + "/photo",
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    //To show photo Immediately after uploading
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if (res.isMain) {
          this._authService.changeMemberPhoto(photo.url);

          //Updating Local Storge from where we are getting our main photo, So it will update authservice.photoUrl and will update in components as well
          this._authService.currentUser.photoUrl = photo.url;
          localStorage.setItem("user", JSON.stringify(this._authService.currentUser));
        }
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this._userService.setMainPhoto(this._authService.decodeToken.nameid, photo.id).subscribe(() => {
      console.log("Successfully Changed DP");
      this.currentMainPhoto = this.photos.filter(x => x.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;

      this._authService.changeMemberPhoto(photo.url);

      //Updating Local Storge from where we are getting our main photo, So it will update authservice.photoUrl and will update in components as well
      this._authService.currentUser.photoUrl = photo.url;
      localStorage.setItem("user", JSON.stringify(this._authService.currentUser));
      // this.getMemberPhotoChange.emit(photo.url);
    }, error => {
      this._alertify.error(error);
    })
  }

  deletePhoto(photoId: number) {
    this._alertify.confirm("Are you sure you want to delete this photo?", () => {
      this._userService.deletePhoto(this._authService.decodeToken.nameid, photoId).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id == photoId), 1);
        this._alertify.success("Photo has been deleted successfully");

      }, error => {
        this._alertify.error(error);
      })
    })

  }
}
