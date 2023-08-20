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
let editPostFlag = false;

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


const postBlogHandler = async () => {
    // console.log(blogTitle.value);
    // console.log(postInputField.value);
    if (blogTitle.value.length < 5 || blogTitle.value.length > 50) {
        Swal.fire({
            icon: 'error',
            title: 'Blog title must be between 5 to 50 characters'
          })
    } else if (blogInputField.value.length < 100 || blogInputField.value.length > 3000) {
        Swal.fire({
            icon: 'error',
            title: 'Your Text must be between 100 to 3000 characters'
          })
    } else {
        try {
            const docRef = await addDoc(collection(db, "myBlogs"), {
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
            // console.log(autherDetails);

            const postElement = document.createElement("div");
            postElement.setAttribute("class", "border p-3 mt-2 mb-3 bgBlogPostColor");
            postElement.setAttribute("style", "border-radius: 10px;");
            postElement.setAttribute("id", doc.id);
            const contentOfPost = `<div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <img src=${autherDetails?.updatedProfilePic ||
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
                        <a class="nav-link fw-bold mt-1 appColor me-4" aria-current="page" onclick="deleteBlog('${postId}')" style="cursor: pointer;" id="deleteBlog">Delete</a>
                        <a class="nav-link fw-bold mt-1 appColor" aria-current="page" onclick="editBlog('${postId}')" style="cursor: pointer;" id="editBlog">Edit</a>
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
    // console.log(uId);
    editPostFlag = true
    postBlogBtn.innerHTML = "Update Blog"
    postBlogBtn.removeEventListener('click', postBlogHandler)
    postBlogBtn.addEventListener('click', updatePostHandler)
    postIdGlobal = uId;
};

const updatePostHandler = () => {
    try {
        // console.log(postIdGlobal);
        const updateDocRef = doc(db, "myBlogs", postIdGlobal);
        const response = updateDoc(updateDocRef, {
            blogTitle: blogTitle.value,
            blogContent: blogInputField.value,
            blogCreatorId: currentLoginUserId,
            currentTime: serverTimestamp(),
        });

        showBlogs();
        blogInputField.value = "";
        blogTitle.value = "";
        postBlogBtn.innerHTML = "Publish Blog"
        postBlogBtn.removeEventListener('click', updatePostHandler)
        postBlogBtn.addEventListener('click', postBlogHandler)

    } catch (error) {
        console.log(error);
    }
};


const deleteBlog = async (uId) => {
    // console.log(uId);
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Blog Deleted Successfully',
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
postBlogBtn.addEventListener("click", postBlogHandler);
postInputField.addEventListener("keyup", enablePostBtn);
//   updateBtn.addEventListener("click", updateProfileHandler);
//   updatePostBtn.addEventListener("click", updatePostHandler);

window.editBlog = editBlog;
window.deleteBlog = deleteBlog;