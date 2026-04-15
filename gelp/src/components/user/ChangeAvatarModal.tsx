import {FC, FormEventHandler, useCallback, useRef, useState} from "react";

type ChangeAvatarModalProps = {
  show: boolean;
  close: () => void;
}

const ChangeAvatarModal: FC<ChangeAvatarModalProps> = ({show, close}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFileChange = useCallback(() => {
    const file = fileRef.current?.files?.[0];

    if (file === undefined)
      return;

    setImage(URL.createObjectURL(file));
  }, []);

  const submit: FormEventHandler = useCallback((e) => {
    e.preventDefault();
    if (fileRef.current === null)
      return;
    if (fileRef.current.files === null)
      return;
    if (loading)
      return;

    const avatar = fileRef.current.files[0];

    const data = new FormData();
    data.set('avatar', avatar);

    setLoading(true);

    fetch('/api/user/avatar', {
      method: 'POST',
      body: data
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 200)
          return location.reload();

        if ('error' in json)
          setError(json.error);
        else
          setError('An unknown error occurred.');
      })
      .catch((e) => {
        setError('An unknown error occurred.');
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!show)
    return null;

  return <div className='w-screen h-screen absolute top-0 left-0 bg-black opacity-80'>
    <div className='w-full h-full flex items-center justify-center'>
      <form className='bg-zinc-900 p-4 rounded-2xl flex flex-col gap-4 min-w-75' onSubmit={submit}>
        <div className='flex gap-2 items-center'>
          {image && <img alt='avatar preview' width={48} height={48} className='rounded-full' src={image}/>}
          <label htmlFor='avatar-file' className='px-2 py-1 bg-zinc-500 hover:bg-zinc-600 rounded-lg ml-auto'>Select Avatar</label>
          <input className='hidden' id='avatar-file' type='file' accept='image/*' ref={fileRef} onChange={onFileChange}/>
        </div>
        <div className='flex gap-2'>
          <button type='submit' className='flex-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-xl' disabled={loading || !image}>Submit</button>
          <button type='button' className='flex-1 bg-zinc-500 hover:bg-zinc-600 p-2 rounded-xl' disabled={loading} onClick={close}>Cancel</button>
        </div>
        {error && <span>{error}</span>}
      </form>
    </div>
  </div>
}

export default ChangeAvatarModal;