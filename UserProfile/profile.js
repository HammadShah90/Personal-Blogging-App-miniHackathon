import {
    auth,
    doc,
    getDoc,
    db,
    query,
    collection,
    where,
    getDocs,
    orderBy,
} from "../firebaseConfig.js";

const profileUserFullname = document.querySelector("#profileUserFullname");
const profileUserName = document.querySelector("#profileUserName");
const profileUserDescription = document.querySelector(
    "#profileUserDescription"
);
const profileUserPic = document.querySelector("#profileUserPic");
const blogPostArea = document.querySelector(".blogPostArea");
const logOutbutton = document.querySelector("#logOut");
const navProfilePic = document.querySelector("#navProfilePic");
const followersCount = document.querySelector(".followersCount");
const followingCount = document.querySelector(".followingCount");

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