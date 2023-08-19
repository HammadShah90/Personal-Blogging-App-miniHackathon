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
  
  // const isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"))
  
  // if (!isLoggedInUser) {
  //     window.location.href = "../index.html";
  // }
  
  // const userPosts = JSON.parse(localStorage.getItem('posts')) || []
  
  const userFullName = document.querySelector("#loginUserName");
  const userProfileName = document.querySelector("#userProfileName");
  const currentUserDescription = document.querySelector(
    "#currentUserDescription"
  );
  const userEmailAddress = document.querySelector("#userEmailAddress");
  const logOutbutton = document.querySelector("#logoutBtn");
  const postInputField = document.querySelector("#postInputField");
  const postBlogBtn = document.querySelector(".postBlogBtn");
  const postArea = document.querySelector(".postArea");
  const editFirstName = document.querySelector("#editFirstName");
  const editSurName = document.querySelector("#editSurName");
  const editUserName = document.querySelector("#editUserName");
  const editUserEmail = document.querySelector("#editUserEmail");
  const editUserMob = document.querySelector("#editUserMob");
  const editUserDescription = document.querySelector("#editUserDescription");
  const profilePic = document.querySelector("#profilePic");
  const updateBtn = document.querySelector("#updateBtn");
  const postProfilePic = document.querySelector("#postProfilePic");
  const showPostProfilePic = document.querySelector("#showPostProfilePic");
  const showPostUserFullname = document.querySelector("#showPostUserFullname");
  const postImagefile = document.querySelector("#postImagefile");
  const updatePostImagefile = document.querySelector("#updatePostImagefile");
  const updatePostInputField = document.querySelector("#updatePostInputField");
  const updatePostBtn = document.querySelector("#updatePostBtn");
  
  // console.log(userFullName);
  
  let currentLoginUserId;
  
  // let currentLoginUser;
  
  showPosts();
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user.email);
      const uid = user.uid;
      console.log(uid);
      getUserDataToEditProfile(uid);
    //   currentLoginUserId = uid;
      // console.log(currentLoginUserId);
    } else {
      window.location.href = `../signIn/signin.html`;
    }
  });
  
  const getUserDataToEditProfile = async (userUid) => {
    // try {
    //   const docRef = doc(db, "users", userUid);
    //   const docSnap = await getDoc(docRef);
  
    //   if (docSnap.exists()) {
    //     const {
    //       userFirstName: userFirstNameFromDb,
    //       userSurName: userSurNameFromDb,
    //       userName: userNameFromDb,
    //       userEmail: userEmailFromDb,
    //       userContactNumber: userContactNumberFromDb,
    //     } = docSnap.data();
  
    //     editFirstName.value = userFirstNameFromDb;
    //     editSurName.value = userSurNameFromDb;
    //     editUserName.value = userNameFromDb;
    //     editUserEmail.value = userEmailFromDb;
    //     editUserMob.value = userContactNumberFromDb;
    //   } else {
    //     console.log("No such document!");
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  
  async function getAutherData(authorUid) {
    // console.log(authorUid, "==>>authorUid")
  
    // const docRef = doc(db, "users", authorUid);
    // const docSnap = await getDoc(docRef);
  
    // if (docSnap.exists()) {
    //   return docSnap.data();
    // } else {
    //   console.log("No such document!");
    // }
  }
  
  const updateProfileHandler = () => {
    // console.log(
    //   editFirstName.value,
    //   editSurName.value,
    //   editUserName.value,
    //   editUserEmail.value,
    //   editUserMob.value,
    //   profilePic.files[0],
    //   "update button working properly"
    // );
  
    // const file = profilePic.files[0];
    // // console.log(file.name);
  
    // // Create the file metadata
    // // @type {any}
    // const metadata = {
    //   contentType: "image/jpeg",
    // };
  
    // // Upload file and metadata to the object 'images/mountains.jpg'
    // if (profilePic.files) {
    //   const storageRef = ref(storage, "userProfilePics/" + file.name);
    //   const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
    //   // Listen for state changes, errors, and completion of the upload.
    //   uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //       const progress =
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       console.log("Upload is " + progress + "% done");
    //       switch (snapshot.state) {
    //         case "paused":
    //           console.log("Upload is paused");
    //           break;
    //         case "running":
    //           console.log("Upload is running");
    //           break;
    //       }
    //     },
    //     (error) => {
    //       // A full list of error codes is available at
    //       // https://firebase.google.com/docs/storage/web/handle-errors
    //       switch (error.code) {
    //         case "storage/unauthorized":
    //           // User doesn't have permission to access the object
    //           break;
    //         case "storage/canceled":
    //           // User canceled the upload
    //           break;
  
    //         // ...
  
    //         case "storage/unknown":
    //           // Unknown error occurred, inspect error.serverResponse
    //           break;
    //       }
    //     },
    //     () => {
    //       // Upload completed successfully, now we can get the download URL
    //       getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    //         console.log("File available at", downloadURL);
    //         try {
    //           const updateUserProfile = doc(db, "users", currentLoginUserId);
    //           const response = await updateDoc(updateUserProfile, {
    //             userContactNumber: editUserMob.value,
    //             userDescription: editUserDescription.value,
    //             profilePic: downloadURL,
    //           });
  
    //           showPosts();
    //         } catch (error) {
    //           console.log(error);
    //         }
    //       });
    //     }
    //   );
    // }
  
    // setTimeout(() => {
    //   window.location.reload()
    // }, 9000)
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
  postBlogBtn.addEventListener("click", postBlogHandler);
  postInputField.addEventListener("keyup", enablePostBtn);
//   updateBtn.addEventListener("click", updateProfileHandler);
//   updatePostBtn.addEventListener("click", updatePostHandler);
  