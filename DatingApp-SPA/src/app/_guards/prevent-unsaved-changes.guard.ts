import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
    providedIn: 'root'
})
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
    canDeactivate(cmpnt: MemberEditComponent) {
        if (cmpnt.editForm.dirty)
            return confirm("Are you sure you want to leave this page? Any unsaved changes will be lost!");
        else
            return true;
    }
}
