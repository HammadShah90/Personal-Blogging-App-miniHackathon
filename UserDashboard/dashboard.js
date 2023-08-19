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


const userFullName = document.querySelector("#loginUserName");
const blogTitle = document.querySelector("#blogTitle");
const currentUserDescription = document.querySelector(
    "#currentUserDescription"
);
const userEmailAddress = document.querySelector("#userEmailAddress");
const logOutbutton = document.querySelector("#logoutBtn");
const blogInputField = document.querySelector("#postInputField");
const postBlogBtn = document.querySelector(".postBlogBtn");
const blogPostArea = document.querySelector(".blogPostArea");
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

postBlogBtn.disabled = true;

let currentLoginUserId;
let postIdGlobal;

// let currentLoginUser;

showBlogs();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // console.log(user.email);
        const uid = user.uid;
        // console.log(uid);
        getUserData(uid);
        //   getUserDataToEditProfile(uid);
        currentLoginUserId = uid;
        //   showAllUsers(user.email);
        // console.log(currentLoginUserId);
    } else {
        window.location.href = `../signIn/signin.html`;
    }
});

async function getUserData(userUid) {
    try {
        const docRef = doc(db, "users", userUid);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            const {
                userFirstName,
                userSurName,
            } = docSnap.data();
            // console.log(userEmail);

            userFullName.textContent = `${userFirstName} ${userSurName}`;

            // console.log(currentLoginUser);
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error);
    }
}

const enablePostBtn = () => {
    if (postInputField.value === "") {
        postBlogBtn.disabled = true; //button remains disabled
    } else {
        postBlogBtn.disabled = false; //button is enabled
    }
};

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



const postBlogHandler = async () => {
    // console.log(blogTitle.value);
    // console.log(postInputField.value);
    try {
        const docRef = addDoc(collection(db, "myBlogs"), {
            blogTitle: blogTitle.value,
            blogContent: blogInputField.value,
            blogCreatorId: currentLoginUserId,
            currentTime: serverTimestamp(),
        });

        showBlogs();
        blogTitle.value = "";
        blogInputField.value = "";
    } catch (error) {
        console.log(error);
    }
};


async function showBlogs() {
    try {
        blogPostArea.innerHTML = "";

        const q = query(collection(db, "myBlogs"), orderBy("currentTime", "desc"));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            // console.log(doc);
            const postId = doc.id;

            const { blogTitle, blogContent, blogCreatorId, currentTime } =
                doc.data();
            // console.log(postContent);
            // console.log(postCreatorId);
            // console.log(currentTime.toDate());

            const autherDetails = await getAutherData(blogCreatorId);

            const postElement = document.createElement("div");
            postElement.setAttribute("class", "border p-3 mt-2 mb-3 bgBlogPostColor");
            postElement.setAttribute("style", "border-radius: 10px;");
            postElement.setAttribute("id", doc.id);
            const contentOfPost = `<div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <img src=${autherDetails?.profilePic ||
                "../Assets/dummy-image.jpg"
                } alt="" class="rounded me-3"
                    style="width: 70px; height: 70px" />
                <div class="d-flex">
                    <div class="align-self-end">
                        <h5 class="mb-0 fw-bold" id="blogPostTitle">
                            ${blogTitle}
                        </h5>
                        <p class="mb-0 fw-medium" style="color: #036796;">
                            <span id="blogPostUserName">
                            ${autherDetails?.userFirstName
                } ${autherDetails?.userSurName} -
                            </span>
                            <span id="blogPostTime">
                            ${moment(currentTime?.toDate()).fromNow()}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <p>
                ${blogContent}
            </p>
            <div class="d-flex">
                        <a class="nav-link fw-bold mt-1 appColor me-4" aria-current="page" onclick="deleteBlog('${postId}')" style="cursor: pointer;">Delete</a>
                        <a class="nav-link fw-bold mt-1 appColor" aria-current="page" onclick="editBlog('${postId}')" style="cursor: pointer;">Edit</a>
                    </div>
        </div>`;

            postElement.innerHTML = contentOfPost;
            // console.log(postElement);
            blogPostArea.appendChild(postElement);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getAutherData(authorUid) {
    // console.log(authorUid, "==>>authorUid")

    const docRef = doc(db, "users", authorUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}

const editBlog = (uId) => {
    console.log(uId);
    postIdGlobal = uId;
};

const updatePostHandler = () => {
    // try {
    //   if (postInputField.value || postImagefile.files[0]) {
    //     // console.log("update button working properly");

    //     // console.log(updatePostInputField.value);

    //     // var currentDate = new Date();

    //     const file = updatePostImagefile.files[0];

    //     if (file) {
    //       // console.log(file);

    //       // Create the file metadata
    //       /** @type {any} */
    //       const metadata = {
    //         contentType: "image/jpeg",
    //       };

    //       // Upload file and metadata to the object 'images/mountains.jpg'
    //       const storageRef = ref(storage, "postImages/" + file.name);
    //       const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    //       // Listen for state changes, errors, and completion of the upload.
    //       uploadTask.on(
    //         "state_changed",
    //         (snapshot) => {
    //           // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //           const progress =
    //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //           console.log("Upload is " + progress + "% done");
    //           switch (snapshot.state) {
    //             case "paused":
    //               console.log("Upload is paused");
    //               break;
    //             case "running":
    //               console.log("Upload is running");
    //               break;
    //           }
    //         },
    //         (error) => {
    //           // A full list of error codes is available at
    //           // https://firebase.google.com/docs/storage/web/handle-errors
    //           switch (error.code) {
    //             case "storage/unauthorized":
    //               // User doesn't have permission to access the object
    //               break;
    //             case "storage/canceled":
    //               // User canceled the upload
    //               break;

    //             // ...

    //             case "storage/unknown":
    //               // Unknown error occurred, inspect error.serverResponse
    //               break;
    //           }
    //         },
    //         () => {
    //           // Upload completed successfully, now we can get the download URL
    //           getDownloadURL(uploadTask.snapshot.ref).then(
    //             async (downloadURL) => {
    //               console.log("File available at", downloadURL);

    //               try {
    //                 const updateDocRef = doc(db, "myPosts", postIdGlobal);
    //                 const response = await updateDoc(updateDocRef, {
    //                   postContent: updatePostInputField.value,
    //                   postImageUrl: downloadURL,
    //                 });

    //                 // console.log(docRef.id);

    //                 showPosts();
    //                 updatePostInputField.value = "";
    //               } catch (error) {
    //                 console.error("Error adding document: ", error);
    //               }
    //             }
    //           );
    //         }
    //       );
    //     } else {
    //       const updateDocRef = doc(db, "myPosts", postIdGlobal);
    //       const response = updateDoc(updateDocRef, {
    //         postContent: updatePostInputField.value,
    //       });

    //       showPosts();
    //       postInputField.value = "";
    //     }
    //   } else {
    //     console.log("Shabash Bacha post mai kuch likho to sahi");
    //     Swal.fire({
    //       icon: "error",
    //       title: "Shabash Bacha post mai kuch likho to sahi",
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
};


const deleteBlog = async (uId) => {
    console.log(uId);
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
    try {
        if (uId) {
            await deleteDoc(doc(db, "myBlogs", uId));
            const dPost = document.getElementById(uId);
            dPost.remove();
            
            console.log("Deleted Successfully");
        } else {
            console.log("show some error");
        }
    } catch (error) {
        console.log(error);
    }
};

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

window.editBlog = editBlog;
window.deleteBlog = deleteBlog;