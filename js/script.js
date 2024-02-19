const rakBuku = [];
let rakPencarian = [];
const RENDER_EVENT = 'render_buku'
const STORAGE_KEY = 'rak_buku'
const SAVED_DATA = 'storage_save'

document.addEventListener('DOMContentLoaded', () => {

  const searchButton = document.getElementById('search-button')
  searchButton.addEventListener('click', () => {
    const keyword = document.getElementById('search').value
    rakPencarian = searchJudul(keyword);

    if(rakPencarian.length == 0){
      noJudul()
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
  })

  const submitForm = document.getElementById('inputBook')
  submitForm.addEventListener('submit', (e) => {
    e.preventDefault()
    tambahBuku()
  })

  if(cekBrowser()){
    loadData()
  }
})

const cekRak = () => {
  const lottie = document.querySelector('.lottie')
  const rakbukuBelumSelesai = document.querySelector('.belum-selesai')
  const rakbukuSudahSelesai = document.querySelector('.sudah-selesai')

  if(rakBuku.length === 0){
    rakbukuBelumSelesai.style.display = 'none'
    rakbukuSudahSelesai.style.display = 'none'
    lottie.style.display = 'block'
  } else{
    rakbukuBelumSelesai.style.display = 'block'
    rakbukuSudahSelesai.style.display = 'block'
    lottie.style.display = 'none'
  }
}

const tambahBuku = () => {
  const generateID = generateId();
  const textJudul = document.getElementById('judul').value
  const textPenulis = document.getElementById('penulis').value
  const textTahun = document.getElementById('tahun').value

  const objekBuku = buatObjek(generateID, textJudul, textPenulis, textTahun, false)
  rakBuku.push(objekBuku)

  document.dispatchEvent(new Event(RENDER_EVENT))

  simpanData()
}

const generateId = () => {
  return +new Date()
}

const buatObjek = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedBuku = document.querySelector('.belum-list-item')
  uncompletedBuku.innerHTML = ''

  const completedBuku = document.querySelector('.sudah-list-item')
  completedBuku.innerHTML = ''

  if(rakPencarian.length === 0){
    for(const item of rakBuku){
      const bukuItem = buatRak(item)
      if(item.isComplete){
        completedBuku.append(bukuItem)
      } else{
        uncompletedBuku.append(bukuItem)
      }
    }
  } else{
    for(const item of rakPencarian){
      const bukuItem = buatRak(item)
      if(item.isComplete){
        completedBuku.append(bukuItem)
      } else{
        uncompletedBuku.append(bukuItem)
      }
    }
  }
    
  cekRak();

})

const buatRak = (bukuObject) => {
  const tahunBuku = document.createElement('p')
  tahunBuku.innerText = `Tahun : ${bukuObject.year}`

  const penulisBuku = document.createElement('p')
  penulisBuku.innerText = `Penulis : ${bukuObject.author}`

  const judulBuku = document.createElement('h1')
  judulBuku.classList.add('item-title')
  judulBuku.innerText = `${bukuObject.title}`

  const buttonSelesai = document.createElement('button')
  buttonSelesai.classList.add('button-selesai')
  buttonSelesai.innerText = 'Selesai Dibaca'

  const buttonHapus = document.createElement('button')
  buttonHapus.classList.add('button-hapus')
  buttonHapus.innerText = 'Hapus Buku'

  const buttonUlangi = document.createElement('button')
  buttonUlangi.classList.add('button-selesai')
  buttonUlangi.innerText = 'Ulangi Baca'

  const containerButton = document.createElement('div')
  containerButton.classList.add('item-button')
  containerButton.append(buttonSelesai, buttonUlangi, buttonHapus)

  const containerDesc = document.createElement('div')
  containerDesc.classList.add('item-desc')
  containerDesc.append(penulisBuku, tahunBuku)

  const containerBody = document.createElement('div')
  containerBody.classList.add('item-body')
  containerBody.append(containerDesc, containerButton)

  const container = document.createElement('div')
  container.classList.add('item-list')
  container.append(judulBuku, containerBody)

  if(bukuObject.isComplete){
    buttonSelesai.classList.add('d-none')
    buttonUlangi.addEventListener('click', () => {
      ulangiBaca(bukuObject.id)
    })

    buttonHapus.addEventListener('click', () => {
      tampilDialogBox(bukuObject.id)
    })
  } else{
    buttonUlangi.classList.add('d-none')
    buttonSelesai.addEventListener('click', () => {
      console.log('asdklaslda')
      selesaiBaca(bukuObject.id)
    })
    
    buttonHapus.addEventListener('click', () => {
      tampilDialogBox(bukuObject.id)
    })
  }

  return container
} 

const selesaiBaca = (id) => {
  const bukuTargetSelesai = cariBuku(id)
  
  if(bukuTargetSelesai == null) return 
  
  bukuTargetSelesai.isComplete = true
  document.dispatchEvent(new Event(RENDER_EVENT))

  simpanData()
}

const ulangiBaca = (id) => {
  const bukuTargetUlangi = cariBuku(id)
  
  if(bukuTargetUlangi == null) return 
  
  bukuTargetUlangi.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT))

  simpanData()
}


const hapusBuku = (id) => {
  const bukuTargetHapus = cariBukuIndex(id)

  if(bukuTargetHapus === -1) return

  rakBuku.splice(bukuTargetHapus, 1)

  document.getElementById('search').value = ''

  document.dispatchEvent(new Event(RENDER_EVENT))

  window.location.reload()

  simpanData()
}

const cariBuku = (idBuku) => {
  for(const item of rakBuku){
    if(item.id === idBuku){
      return item
    }
  }
  return null
}

const cariBukuIndex = (idBuku) => {
  for(const idx in rakBuku){
    if(rakBuku[idx].id === idBuku){
      return idx
    }
  }
  return -1
}

const cekBrowser = () => {
  if(typeof(Storage) === undefined){
    alert('Browser yang anda gunakan, tidak support storage')
    return false
  }
  return true
}

const simpanData = () => {
  if(cekBrowser()){
    const parse = JSON.stringify(rakBuku)
    localStorage.setItem(STORAGE_KEY, parse)
    document.dispatchEvent(new Event(SAVED_DATA))
  }
}

const loadData = () => {
  const ambilData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(ambilData)

  if(data != null){
    for(const buku of data){
      rakBuku.push(buku)
    }
    document.dispatchEvent(new Event(RENDER_EVENT))
  }
}


const noJudul = () => {
  const kembaliButton = document.createElement('button')
  kembaliButton.classList.add('hapus')
  kembaliButton.innerText = 'Kembali'

  const dialog = document.createElement('h2')
  dialog.innerText = 'Judul yang anda cari tidak ada dalam rak anda.'

  const wrapperButton = document.createElement('div')
  wrapperButton.classList.add('button-wrapper')
  wrapperButton.append(kembaliButton)

  const box = document.createElement('div')
  box.classList.add('box')
  box.append(dialog, wrapperButton)

  const dialogBox = document.createElement('div')
  dialogBox.classList.add('dialog-box')
  dialogBox.append(box)

  const body = document.body.append(dialogBox)

  kembaliButton.addEventListener('click', () => {
    document.body.removeChild(dialogBox)
  })

  return body
}

const tampilDialogBox = (idBuku) => {
  const hapusButton = document.createElement('button')
  hapusButton.classList.add('hapus')
  hapusButton.innerText = 'Iya'

  const janganButton = document.createElement('button')
  janganButton.classList.add('tidak')
  janganButton.innerText = 'Tidak'

  const dialog = document.createElement('h2')
  dialog.innerText = 'Yakin ingin menghapus buku ini dari rak?'

  const wrapperButton = document.createElement('div')
  wrapperButton.classList.add('button-wrapper')
  wrapperButton.append(hapusButton, janganButton)

  const box = document.createElement('div')
  box.classList.add('box')
  box.append(dialog, wrapperButton)

  const dialogBox = document.createElement('div')
  dialogBox.classList.add('dialog-box')
  dialogBox.append(box)

  const body = document.body.append(dialogBox)

  janganButton.addEventListener('click', () => {
    document.body.removeChild(dialogBox)
  })
  
  hapusButton.addEventListener('click', () => {
    hapusBuku(idBuku)
    document.body.removeChild(dialogBox)
  })

  return body
}


const searchJudul = (key) => {
  let filterBuku = rakBuku.filter(item => {
    const judul = item.title.toLowerCase()
    const keyword = key.toLowerCase()

    return judul.includes(keyword)
  })

  console.log(filterBuku)
  return filterBuku.length >= 1 ? filterBuku : rakPencarian 

}


