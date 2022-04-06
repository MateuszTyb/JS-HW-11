import axios from 'axios';
import Notiflix from 'notiflix';

const input = document.querySelector('input');
const searchButton = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('button[type="button"]');

let pageNumber = 1;
let imageCounter = 0;

async function findImage(name, page) {
  try {
    const res = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?key=24769150-bf60fd494e1bb18e096706ef6&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
    });
    return res.data;
  } catch (error) {
    return Notiflix.Notify.failure('Error!');
  }
}

function clearResults() {
  gallery.innerHTML = '';
  pageNumber = 1;
  imageCounter = 0;
  loadMoreButton.classList.add('is-hidden');
}

let foundImages = [];
let totalHits;

searchButton.addEventListener('click', event => {
  event.preventDefault();
  clearResults();
  findImage(input.value, pageNumber).then(res => {
    if (input.value === '') {
      Notiflix.Notify.failure('Put some name.');
    } else if (res.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      Notiflix.Notify.success(`We found ${res.total} images.`);
      foundImages = res.hits;
      totalHits = res.totalHits;
      createGallery();
      if (totalHits > 40) {
        loadMoreButton.classList.remove('is-hidden');
      }
    }
  });
});

function createGallery() {
  foundImages.forEach(function (image) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.innerHTML = `
    <div class="photo">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${image.downloads}
        </p>
      </div>`;
    gallery.append(photoCard);
    imageCounter++;
  });
  Notiflix.Notify.info(`Display ${imageCounter} from ${totalHits} images`);
  if (imageCounter >= totalHits) {
    loadMoreButton.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function loadImages() {
  loadMoreButton.classList.add('is-hidden');
  pageNumber++;
  findImage(input.value, pageNumber).then(res => {
    foundImages = res.hits;
    createGallery();
  });
  if (imageCounter < totalHits) {
    loadMoreButton.classList.remove('is-hidden');
  }
}

loadMoreButton.addEventListener('click', loadImages);
