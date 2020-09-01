import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private _userService: UserService, private _alterify: AlertifyService, private _route: ActivatedRoute) { }

  ngOnInit() {

    // Below method is to get data from resolver
    this._route.data.subscribe(data => {
      this.user = data['userdetail'];
      // console.log(this.user)
    });


    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        preview: false,
        imageAnimation: NgxGalleryAnimation.Slide
      }];
    this.galleryImages = this.getImages();

  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });

    }
    // console.log(imageUrls);
    return imageUrls;
  }

  //members/id
  // loadUser() {

  //   this._userService.getUser(+this._route.snapshot.params['id']).subscribe((response: User) => {
  //     this.user = response;
  //   }, error => {
  //     this._alterify.error(error);
  //   });
  // }

}
