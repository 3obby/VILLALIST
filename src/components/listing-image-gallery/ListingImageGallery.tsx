"use client";

import "./styles/index.css";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, Fragment, useEffect, useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { GalleryImage } from "@prisma/client";

interface Props {
  images: GalleryImage[]; 
  onClose?: () => void;
  isShowModal: boolean;
}

const ListingImageGallery: FC<Props> = ({ images, onClose, isShowModal }) => {
  const searchParams = useSearchParams();
  const photoId = searchParams?.get("photoId");
  const router = useRouter();

  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);
  const thisPathname = usePathname();

  useEffect(() => {
    // Ensure scroll to last viewed photo if modal is closed
    if (photoId && !isShowModal) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
    }
  }, [photoId, isShowModal]);

  const handleClose = () => {
    onClose && onClose();
  };

  // const handleImageClick = (index: number) => {
  //   const params = new URLSearchParams(document.location.search);
  //   params.set("photoId", String(index));
  //   router.push(`${thisPathname}/?${params.toString()}`);
  // };

  const renderContent = () => {
    return (
      <div className=" ">
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {images.map((url, index) => (
            <div
              key={index}
              // onClick={() => handleImageClick(index)}
              ref={index === Number(photoId) ? lastViewedPhotoRef : null}
              className="group relative mb-5 block w-full cursor-zoom-in focus:outline-none"
            >
              <Image
                alt="Listing gallery image"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 focus:outline-none"
                style={{
                  transform: "translate3d(0, 0, 0)",
                }}
                src={url.url}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Transition appear show={isShowModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="sticky z-10 top-0 p-4 xl:px-10 flex items-center justify-between bg-white">
              <button
                className="focus:outline-none focus:ring-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100"
                onClick={handleClose}
              >
                <ArrowSmallLeftIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex min-h-full items-center justify-center sm:p-4 pt-0 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-5"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-5"
              >
                <Dialog.Panel className="w-full max-w-screen-lg mx-auto transform p-4 pt-0 text-left transition-all ">
                  {renderContent()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ListingImageGallery;
