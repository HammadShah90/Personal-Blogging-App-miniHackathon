import {
  auth,
  onAuthStateChanged,
  getDoc,
  doc,
  db,
  signOut,
  addDoc,
  collection,
  orderBy,
  getDocs,
  query,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  setDoc,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "../firebaseConfig.js";


const updateProfileBtn = document.querySelector(
  ".updateProfileBtn"
);
const logOutbutton = document.querySelector("#logoutBtn");
const editFirstName = document.querySelector("#editFirstName");
const editSurName = document.querySelector("#editSurName");
const oldPassword = document.querySelector("#oldPassword");
const updatedNewPassword = document.querySelector("#newPassword");
const updatedConfirmPassword = document.querySelector("#confirmPassword");
const updateImagefile = document.querySelector("#updateImagefile");
const editProfileImg = document.querySelector(".editProfileImg");

// console.log(userFullName);

let currentLoginUserId;
let UserOldpassword;


onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log(user.email);
    const uid = user.uid;
    console.log(uid);
    getUserDataToEditProfile(uid);
    currentLoginUserId = uid;
    // console.log(currentLoginUserId);
  } else {
    window.location.href = `../signIn/signin.html`;
  }
});


const getUserDataToEditProfile = async (userUid) => {
  console.log(userUid);
  try {
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {
        userFirstName: userFirstNameFromDb,
        userSurName: userSurNameFromDb,
        userPassword: userPasswordfromDb,
        updatedProfilePic: updatedProfilePicDb,
      } = docSnap.data();
      // console.log(userPasswordfromDb);
      UserOldpassword = userPasswordfromDb;
      editFirstName.value = userFirstNameFromDb;
      editSurName.value = userSurNameFromDb;
      editProfileImg.src = updatedProfilePicDb;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};

async function getAutherData(authorUid) {
  console.log(authorUid, "==>>authorUid")

  const docRef = doc(db, "users", authorUid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}


const updateProfileHandler = () => {
  const file = updateImagefile.files[0];
  if (oldPassword.value !== UserOldpassword) {
    return Swal.fire({
      icon: 'error',
      title: 'your Old password is not match'
    })
  } else {
    if (updatedNewPassword.value.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Your password should be contains atleast 8 characters'
      })
    } else if (updatedConfirmPassword.value !== updatedNewPassword.value) {
      Swal.fire({
        icon: 'error',
        title: 'Your confirm password is not match to your new password'
      })
    } else {
      if (file) {
        
        const metadata = {
          contentType: "image/jpeg",
        };

        const storageRef = ref(storage, "userProfilePics/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                break;
              case "storage/canceled":
                break;
              case "storage/unknown":
                break;
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log("File available at", downloadURL);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Profile Updated Successfully',
                showConfirmButton: false,
                timer: 1500
              })
              try {
                const updateUserProfile = doc(db, "users", currentLoginUserId);
                const response = await updateDoc(updateUserProfile, {
                  userPassword: updatedNewPassword.value,
                  userConfirmPassword: updatedConfirmPassword.value,
                  userFirstName: editFirstName.value,
                  userSurName: editSurName.value,
                  updatedProfilePic: downloadURL,
                });
                window.location.href = `../UserDashboard/dashboard.html`
              } catch (error) {
                console.log(error);
              }
            });
          }
        );
      } else {
        const updateUserProfile = doc(db, "users", currentLoginUserId);
        const response = updateDoc(updateUserProfile, {
          userPassword: updatedNewPassword.value,
          userConfirmPassword: updatedConfirmPassword.value,
          userFirstName: editFirstName.value,
          userSurName: editSurName.value
        });
        setTimeout(()=>{
          window.location.href = `../UserDashboard/dashboard.html`
        }, 2000)
      }
    }
  }
};

const logoutHandler = async () => {
  try {
    const response = await signOut(auth);
    console.log(response);
    window.location.href = `../index.html`
  } catch (error) {
    console.log(error);
  }
};

logOutbutton.addEventListener("click", logoutHandler);
updateProfileBtn.addEventListener("click", updateProfileHandler);
