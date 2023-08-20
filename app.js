import {
    auth,
    onAuthStateChanged,
    doc,
    getDoc,
    db,
    query,
    collection,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    signOut,
    updateDoc,
} from "./firebaseConfig.js";

const profileUserFullname = document.querySelector("#profileUserFullname");
const profileUserName = document.querySelector("#profileUserName");
const profileUserDescription = document.querySelector(
    "#profileUserDescription"
);
let greeting = document.querySelector(".greeting");
const blogPostArea = document.querySelector(".blogPostArea");

// console.log(followersCount);
// console.log(followingCount);
// console.log(profileUserDescription);
// console.log(profileUserPic);

let currentLoginUserId;

const greetingToUser = () => {
    let currentTime = new Date()
    let hours = currentTime.getHours()
    // console.log(currentTime.getHours());
    if (hours < 12) {
        console.log('Good Morning');
        greeting.innerHTML = `Good Morning Readers!`
    } else if (hours >= 12 && hours <= 17) {
        console.log('Good Afternoon');
        greeting.innerHTML = `Good Afternoon Readers!`
    } else if (hours >= 17 && hours <= 20) {
        console.log('Good Evening');
        greeting.innerHTML = `Good Evening Readers!`
    } else if (hours >= 20 && hours <= 24) {
        console.log('Good Night');
        greeting.innerHTML = `Good Night Readers!`
    }
}

greetingToUser()

// ===========>>>>>>>> Get User data <<<<<<<<=========

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         const uid = user.uid;
//         // console.log(uid);
//         //   getUserData(uid)
//         //   getUserDataToEditProfile(uid)
//         getUserData(uid);
//         getUserDataToEditProfile(uid);
//         showPosts(uid);
//         currentLoginUserId = uid;
//     } else {
//         window.location.href = `../dashboard/dashboard.html`;
//     }
// });


// ===========>>>>>>>> Show Current User Posts <<<<<<<<=========

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
            <a class="nav-link fw-bold mt-1 appColor" aria-current="page" href="./UserProfile/profile.html">See all from this user</a>
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

showBlogs()


