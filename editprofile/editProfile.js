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
const newPassword = document.querySelector("#newPassword");
const confirmPassword = document.querySelector("#confirmPassword");
const updateImagefile = document.querySelector("#updateImagefile");
const editProfileImg = document.querySelector(".editProfileImg");

// console.log(userFullName);

let currentLoginUserId;


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
      } = docSnap.data();

      editFirstName.value = userFirstNameFromDb;
      editSurName.value = userSurNameFromDb;
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
  console.log(
    editFirstName.value,
    editSurName.value,
    userPassword.value,
    updateImagefile.files[0],
    "update button working properly"
  );

  const file = updateImagefile.files[0];
  // console.log(file.name);


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
        try {
          const updateUserProfile = doc(db, "users", currentLoginUserId);
          const response = await updateDoc(updateUserProfile, {
            newUpdatedPassword: newPassword.value,
            confirmUpdatedPassword: confirmPassword.value,
            updatedProfilePic: downloadURL,
          });

        } catch (error) {
          console.log(error);
        }
      });
    }
  );
};

const logoutHandler = async () => {
  try {
    const response = await signOut(auth);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

logOutbutton.addEventListener("click", logoutHandler);
updateProfileBtn.addEventListener("click", updateProfileHandler);
