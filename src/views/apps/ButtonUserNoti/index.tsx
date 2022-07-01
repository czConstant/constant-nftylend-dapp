import { useEffect, useMemo, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuList, Text, Icon, Center, Avatar, Flex, Button, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import debounce from 'lodash/debounce';

import { getNotifications, seenNotification } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { NotificationData } from 'src/modules/nftLend/models/api';
import Loading from 'src/common/components/loading';
import { useAppSelector } from 'src/store/hooks';
import { selectUserSettings } from 'src/store/nftyLend';
import { getImageThumb } from 'src/modules/nftLend/utils';

const DEFAULT_PAGE_SIZE = 5

const ButtonUserNoti = () => {
  const { currentWallet, syncUserSettings } = useCurrentWallet()
  const navigate = useNavigate()
  const settings = useAppSelector(selectUserSettings)

  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const resetList = () => {
    setHasMore(true)
    setNotifications([])
    setPage(1)
  }
  
  const onOpen = async () => {
    fetchNotifications(1)
  }

  const fetchNotifications = async (page: number) => {
    try {
      setLoading(true)
      const res = await getNotifications({ address: currentWallet.address, network: currentWallet.chain, page, limit: pageSize })
      if (res.result.length < DEFAULT_PAGE_SIZE) setHasMore(false)
      if (page === 1 && res.result.length > 0 && res.result[0].id > settings.seen_noti_id) updateSeenNoti(res.result[0].id)
      setPage(page)
      setNotifications([...notifications, ...res.result])
    } finally {
      setLoading(false)
    }
  }

  const updateSeenNoti = async (seenId: number) => {
    await seenNotification(currentWallet.address, currentWallet.chain, seenId)
    syncUserSettings()
  }

  return (
    <Menu autoSelect={false} placement='bottom-end' onOpen={onOpen} onClose={resetList}>
      <MenuButton position='relative' h='40px' borderRadius={20} fontWeight='semibold'>
        <Center w='40px' h='40px'>
          <Icon fontSize='xl' as={MdOutlineNotificationsNone} />
        </Center>
        {settings.new_noti_num > 0 && <Center position='absolute' fontWeight='bold' fontSize='10px' bottom={0} right={-2} w={4} h={4} borderRadius={50} bgColor='brand.danger.600'>{settings.new_noti_num}</Center>}
      </MenuButton>
      <MenuList zIndex={2} maxW={300} maxH={600} overflowY='scroll'>
        {notifications.map(e => {
          return (
            <MenuItem onClick={() => e.redirect_url && navigate(e.redirect_url)}>
              <Flex gap={4}>
                <Avatar src={getImageThumb({ url: e.image_url, width: 50, height: 50 })} />
                <Flex direction='column'>
                  <Text fontSize='sm' fontWeight='medium'>{e.title}</Text>
                  <Text fontSize='xs' color='text.secondary' noOfLines={2}>{e.content}</Text>
                </Flex>
              </Flex>
            </MenuItem>
          )
        })}
        {hasMore && (loading
          ? <Loading />
          : <Button
              w='100%'
              variant='link'
              onClick={() => fetchNotifications(page+1)}
            >
              View more
            </Button>
        )}
      </MenuList>
    </Menu>
  );
};

export default ButtonUserNoti;