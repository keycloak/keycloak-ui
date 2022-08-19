import PageObject from "../../components/PageObject";
import ListingPage from "../../ListingPage";
import UserDetailsPage from "./user_details/UserDetailsPage";

const listingPage = new ListingPage();

export default class UsersPage extends PageObject {
  goToUserListTab() {
    return new UserListTab();
  }

  goToPermissionsTab() {
    return new PermissionsTab();
  }
}

class UserListTab {
  public goToUserDetailsPage(username: string) {
    listingPage.goToItemDetails(username);

    return new UserDetailsPage();
  }

  public searchUser(username: string) {
    listingPage.searchItem(username);

    return this;
  }
}

