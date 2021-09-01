import { useState, useContext } from 'react';
import './styles.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png'
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';







export default function Profile() {

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatarUrl, setImageAvatarUrl] = useState(null)

    async function handleSave(e) {
        e.preventDefault();
        if (imageAvatarUrl === null && name !== '') {
            await firebase.firestore().collection('user')
                .doc(user.uid)
                .update({
                    name: name,
                })
                .then(() => {
                    let data = {
                        // joga o que ja tem e so altera o name
                        ...user,
                        name: name,
                    };
                    setUser(data);
                    storageUser(data);
                })
        }
        else if (name !== '' && imageAvatarUrl !== null) {
            handlUploadImage()
        }
    }

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatarUrl(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            } else {
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setImageAvatarUrl(null);
                return null;
            }
        }
    }

    async function handlUploadImage() {
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
            .ref(`images/${currentUid}/${imageAvatarUrl.name}`)
            .put(imageAvatarUrl)
            .then( async () => {
                alert('ok')
                await firebase.storage()
                    .ref(`images/${currentUid}`)
                    .child(imageAvatarUrl.name).getDownloadURL()
                    .then( async (url) => {
                        let urlPhoto = url;
                        await firebase.firestore().collection('user')
                            .doc(user.uid)
                            .update({
                                avatarUrl: urlPhoto,
                                name: name,
                            })
                            .then( () => {
                                let data = {
                                    // joga o que ja tem e so altera o name e avatarUrl
                                    ...user,
                                    name: name,
                                    avatarUrl: urlPhoto,
                                };
                                setUser(data);
                                storageUser(data);
                            })
                    })

            })
    }


    return (
        <div>
            <Header />
            <div className="content" >
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form onSubmit={handleSave} className="form-profile">
                        <label className="avatar">
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile}/> <br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="foto de perfil" />
                                :
                                <img src={avatarUrl} width="250" height="250" alt="foto de perfil" />
                            }
                        </label>

                        <label>Nome:</label>
                        <input type="text" value={name} placeholder="Nome" onChange={(e) => setName(e.target.value)} />

                        <label>Email:</label>
                        <input type="text" value={email} placeholder="Email" disabled={true} />

                        <button type="submit">Salvar</button>
                    </form>
                </div>
                <div className="container">
                    <button className="logout-btn" onClick={() => signOut()}>Sair</button>
                </div>
            </div>
        </div>

    )
}