import { useEffect, useMemo, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuList, Text, Icon, Center, Avatar, Flex, Button, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineNotificationsNone } from 'react-icons/md';

import { getNotifications, seenNotification } from 'src/modules/nftLend/api';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { NotificationData } from 'src/modules/nftLend/models/api';
import Loading from 'src/common/components/loading';
import { useAppSelector } from 'src/store/hooks';
import { selectUserSettings } from 'src/store/nftyLend';
import { getImageThumb } from 'src/modules/nftLend/utils';
import EmptyList from 'src/common/components/emptyList';

const DEFAULT_PAGE_SIZE = 5

const ButtonUserNoti = () => {
  const { currentWallet, syncUserSettings } = useCurrentWallet()
  const navigate = useNavigate()
  const settings = useAppSelector(selectUserSettings)

  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [displayList, setDisplayList] = useState<NotificationData[]>([])

  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    if (unreadOnly) setDisplayList(notifications.filter(e => e.id > settings.seen_noti_id))
    else setDisplayList([...notifications])
  }, [notifications, unreadOnly])

  const onClose = () => {
    if (notifications.length > 0 && notifications[0].id > settings.seen_noti_id) updateSeenNoti(notifications[0].id)
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

  const renderEmpty = () => (
    <EmptyList labelText={unreadOnly ? 'No unread notifications' : 'No notifications'} imageSize={20} />
  )

  return (
    <Menu autoSelect={false} placement='bottom-end' onOpen={onOpen} onClose={onClose}>
      <MenuButton position='relative' h='40px' borderRadius={20} fontWeight='semibold'>
        <Center w='40px' h='40px'>
          <Icon fontSize='xl' as={MdOutlineNotificationsNone} />
        </Center>
        {settings.new_noti_num > 0 && <Center position='absolute' fontWeight='bold' fontSize='10px' bottom={0} right={-2} w={4} h={4} borderRadius={50} bgColor='brand.danger.600'>{settings.new_noti_num}</Center>}
      </MenuButton>
      <MenuList zIndex={2} w={300} maxH={600} overflowY='scroll'>
        <Text m={4} cursor='pointer' fontSize='xs' fontWeight='semibold' textDecoration='underline' onClick={() => setUnreadOnly(!unreadOnly)}>{unreadOnly ? 'View all' : 'Filter by unread'}</Text>
        {!loading && displayList.length === 0 && renderEmpty()}
        {displayList.map(e => {
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
        {loading && <Loading />}
        {!unreadOnly && hasMore && !loading && (
          <Button
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