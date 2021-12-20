/* eslint-disable react/no-children-prop */
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Container,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputRightElement,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { getHostFromURL } from 'utils/helper';
import { trpc } from 'utils/trpc';
import { nanoid } from 'nanoid';
import { RepeatIcon } from '@chakra-ui/icons';

const domainHostName = getHostFromURL(
  process.env.NEXT_PUBLIC_BASE_DOMAIN || '',
);

function LinksPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [newUrlSlug, setNewUrlSlug] = useState<string>('');
  const [destinationUrl, setDestinationUrl] = useState<string>('');

  const trpcUtils = trpc.useContext();
  const linkQuery = trpc.useQuery(['link.getAll']);

  const addNewLink = trpc.useMutation('link.add', {
    async onSuccess() {
      await trpcUtils.invalidateQueries(['link.getAll']);
    },
  });

  const handleCreateNewLink = async () => {
    try {
      const data = {
        destinationUrl,
        slug: newUrlSlug,
      };
      await addNewLink.mutateAsync(data);
      toast({
        title: 'Link created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.log(`Type of`, typeof error);
      console.log(`error`, error);
      toast({
        title: 'Failed to create link',
        description: error?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Container maxW="container.xl">
        <Box
          w="full"
          my="8"
          alignItems={'center'}
          d="flex"
          justifyContent="space-between"
        >
          <Box>
            <Heading m={0} p={0}>
              Links
            </Heading>
          </Box>
          <Button
            colorScheme={'blue'}
            onClick={() => {
              onOpen();
              setNewUrlSlug(nanoid(5));
            }}
          >
            New Link
          </Button>
        </Box>

        <Box>
          {linkQuery.data?.map((item, idx) => (
            <Accordion allowMultiple allowToggle key={idx}>
              <AccordionItem>
                <Box>
                  <AccordionButton p={4}>
                    <Box flex="1" textAlign="left">
                      {`${domainHostName}/${item.shortSlug}`}
                    </Box>
                  </AccordionButton>
                </Box>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="email">Destination URL</FormLabel>
              <Input
                type="text"
                name="destinationUrl"
                value={destinationUrl || ''}
                onChange={(e) => setDestinationUrl(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel htmlFor="email">Short URL</FormLabel>
              <InputGroup>
                <InputLeftAddon children={`${domainHostName}/`} />
                <Input
                  value={newUrlSlug}
                  onChange={(e) => setNewUrlSlug(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="regenerate-id"
                    variant={'ghost'}
                    onClick={() => setNewUrlSlug(nanoid(5))}
                    icon={<RepeatIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateNewLink}>
              Create link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LinksPage;
